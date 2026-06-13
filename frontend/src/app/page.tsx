import Link from 'next/link';
import { ArrowRightIcon, CloudArrowUpIcon, ShareIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TX</span>
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">TX-M6</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Fast, Secure File Hosting &
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Sharing</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Upload, store, manage, and share your files securely from any device. Experience the speed and simplicity of TX-M6.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="btn btn-primary text-base px-8 py-3">
                Start Free Trial <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <button className="btn btn-secondary text-base px-8 py-3">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={item} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <CloudArrowUpIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Fast Upload</h3>
              <p className="text-slate-600 dark:text-slate-300">Upload files up to 5GB with drag & drop support. Experience lightning-fast speeds.</p>
            </motion.div>

            <motion.div variants={item} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <ShareIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Easy Sharing</h3>
              <p className="text-slate-600 dark:text-slate-300">Generate instant share links with custom settings and password protection.</p>
            </motion.div>

            <motion.div variants={item} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <LockClosedIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure Storage</h3>
              <p className="text-slate-600 dark:text-slate-300">Your files are encrypted and securely stored with enterprise-grade protection.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of users who trust TX-M6 for their file storage needs.
          </p>
          <Link href="/register" className="btn btn-primary text-base px-8 py-3">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Follow</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Twitter</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">GitHub</Link></li>
                <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white">Discord</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-slate-600 dark:text-slate-300">
            <p>&copy; 2024 TX-M6. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
