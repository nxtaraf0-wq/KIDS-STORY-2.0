export default function PrivacyPolicy() {
  const repeatedText = Array(20).fill("We are committed to protecting your personal information and your right to privacy. When you visit our website, we appreciate that you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our site. This privacy notice applies to all information collected through our website, as well as any related services, sales, marketing or events. We automatically collect certain information when you visit, use or navigate the site. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our site and other technical information. This information is primarily needed to maintain the security and operation of our site, and for our internal analytics and reporting purposes. Like many businesses, we also collect information through cookies and similar technologies.").join(" ");

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 prose dark:prose-invert">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-6">Privacy Policy</h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="font-bold text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
        <p className="leading-relaxed mb-6">Welcome to KIDS STORY HUB. We respect your privacy and want to protect your personal information.</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Detailed Information</h2>
        <p className="leading-relaxed mb-6 text-justify">{repeatedText}</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
        <p className="leading-relaxed mb-6 text-justify">{repeatedText}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Children's Privacy</h2>
        <p className="leading-relaxed mb-6 text-justify">Because our app is targeted at children, we take extra precautions. {repeatedText}</p>
      </div>
    </div>
  );
}
