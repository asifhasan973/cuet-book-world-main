import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'How do I register for CUET Bookworld?', a: 'Click on "Get Started" or "Sign Up" on the login page. Fill in your CUET credentials including your student ID, department, and CUET email address. After registration, your account will be activated.'},
  { q: 'How many books can I borrow?', a: '1st, 2nd, and 3rd year students can borrow up to 3 books. 4th year students can borrow up to 4 books. Faculty members can borrow up to 6 books at a time.' },
  { q: 'How long can I keep a borrowed book?', a: 'The standard borrowing period is 30 days from the date of approval. You can request a renewal before or after the due date.' },
  { q: 'What happens if I return a book late?', a: 'A fine of 1 Tk per day per book will be applied after the due date. You can view your accumulated fines on your profile page.' },
  { q: 'How do I renew a borrowed book?', a: 'Go to the "Renew" page, select the book you want to renew, choose a preferred date and time slot, and submit your renewal request. A librarian will approve it and may schedule a meeting.' },
  { q: 'Can I read e-books without borrowing?', a: 'Yes! E-books are available for reading online without any borrowing process. Simply go to the E-Books page and click "Read Online" on any available e-book.' },
  { q: 'How do I schedule a video consultation?', a: 'Navigate to the "Video" page, fill in the consultation request form with your topic, preferred date and time, and submit. A librarian will approve and share the meeting link.' },
  { q: 'What are the library hours?', a: 'The CUET Library is open Saturday through Thursday from 8:00 AM to 8:00 PM. The library is closed on Fridays.' },
  { q: 'How can I contact the library?', a: 'You can email us at library@cuet.ac.bd or call +880-31-XXXXXX during library hours. You can also use the Contact page to send us a message.' },
  { q: 'Can I suggest a book to be added to the library?', a: 'Currently, you can contact the library directly with book suggestions. We plan to add a "Book Request" feature in a future update.' },
];

const FAQPage = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 page-enter">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-slate-500 dark:text-slate-400">Find answers to common questions about CUET Bookworld.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <span className="font-medium text-slate-800 dark:text-white pr-4">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform flex-shrink-0 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
