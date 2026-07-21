export default function AboutPage() {
  return (
    <main className="min-h-screen  text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">About Bhaichara</h1>

        <div className="space-y-6 text-gray-300 leading-8">
          <p>
            <span className="font-semibold text-white">Bhaichara</span> is a
            simple video sharing platform where users can discover and watch
            videos from various sources in one place. Our goal is to provide a
            clean, fast, and user-friendly viewing experience.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Our Platform
            </h2>
            <p>
              Bhaichara does <strong>not host or store</strong> video files on
              our servers. We only render or embed content that is available
              from third-party sources. All rights to the respective content
              belong to their original owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Content Removal
            </h2>
            <p>
              If you are the copyright owner or an authorized representative and
              believe that any content displayed on Bhaichara should be removed,
              please contact us with the relevant details.
            </p>

            <div className="mt-4 rounded-lg border border-gray-800  p-4">
              <p className="font-medium text-white">Content Removal Email</p>
              <a
                href="mailto:stagepass7@gmail.com
"
                className="text-blue-400 hover:text-blue-300"
              >
                stagepass7@gmail.com
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Disclaimer
            </h2>
            <p>
              Bhaichara acts solely as a platform for displaying content from
              external sources. We do not claim ownership of any third-party
              videos, and all trademarks, logos, and copyrights belong to their
              respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
            <p>
              For general inquiries or content removal requests, email us at{" "}
              <a
                href="mailto:stagepass7@gmail.com
"
                className="text-blue-400 hover:text-blue-300"
              >
                stagepass7@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
