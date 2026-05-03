export default function Terms() {
  const repeatedText = Array(20).fill("These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and our platform, concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto. You agree that by accessing the site, you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the site and you must discontinue use immediately. Supplemental terms and conditions or documents that may be posted on the site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the last updated date of these Terms of Service, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Terms of Service to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms of Service by your continued use of the site after the date such revised Terms of Service are posted. The information provided on the site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.").join(" ");

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 prose dark:prose-invert">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-6">Terms of Service</h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="font-bold text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
        <p className="leading-relaxed mb-6">By accessing KIDS STORY HUB, you agree to the following terms and conditions.</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Intellectual Property Rights</h2>
        <p className="leading-relaxed mb-6 text-justify">{repeatedText}</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">3. User Representations</h2>
        <p className="leading-relaxed mb-6 text-justify">{repeatedText}</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Prohibited Activities</h2>
        <p className="leading-relaxed mb-6 text-justify">You may not access or use the site for any purpose other than that for which we make the site available. {repeatedText}</p>
      </div>
    </div>
  );
}
