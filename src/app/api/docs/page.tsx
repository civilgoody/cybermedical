'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const exampleReport = {
  severity: "high",
  description: "Multiple failed SSH login attempts detected from IP 192.168.1.100",
  analysis: "Pattern suggests a brute force attack targeting SSH service. Source IP has been flagged for suspicious activity across multiple time windows. Recommended actions: 1) Block the source IP, 2) Review SSH configuration, 3) Implement rate limiting."
};

const exampleResponse = {
  id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
  created_at: "2024-01-30T10:48:09.341Z",
  severity: "high",
  description: "Multiple failed SSH login attempts detected from IP 192.168.1.100",
  analysis: "Pattern suggests a brute force attack targeting SSH service..."
};

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-green-900/20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="mb-6 flex justify-center">
            <a 
              href="/" 
              className="text-green-400 hover:text-green-300 text-sm border border-green-900/20 bg-black/40 px-3 py-1.5 rounded-md hover:border-green-500/50 transition-colors inline-flex items-center"
            >
              ← Back to Dashboard
            </a>
          </nav>
          <h1 className="text-4xl font-bold text-center cyber-glow text-green-400">
            API Documentation
          </h1>
          <p className="text-center mt-2 text-green-300/60">
            Cyber Defense Monitor API Reference
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 space-y-6">
        {/* Overview */}
        <Card className="bg-black/20 border-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-400">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-green-300/80">
            <p>
              The Cyber Defense Monitor API allows you to submit and retrieve attack reports.
              All endpoints return data in JSON format.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Base URL</h3>
              <code className="bg-black/40 px-2 py-1 rounded text-green-400">
                https://cybereport.vercel.app/api
              </code>
            </div>
          </CardContent>
        </Card>

        {/* POST /api/reports */}
        <Card className="bg-black/20 border-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-400">Create Attack Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Endpoint</h3>
              <code className="bg-black/40 px-2 py-1 rounded text-green-300">
                POST /api/reports
              </code>
            </div>

            <div>
              <h3 className="font-semibold text-green-400 mb-2">Request Body</h3>
              <pre className="bg-black/40 p-4 rounded overflow-x-auto">
                <code className="text-green-300">
                  {JSON.stringify(exampleReport, null, 2)}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-green-400 mb-2">Response</h3>
              <pre className="bg-black/40 p-4 rounded overflow-x-auto">
                <code className="text-green-300">
                  {JSON.stringify(exampleResponse, null, 2)}
                </code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-green-400">Fields</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300/80">
                <li><code className="text-green-400">severity</code>: Required (low | medium | high | critical)</li>
                <li><code className="text-green-400">description</code>: Required (string)</li>
                <li><code className="text-green-400">analysis</code>: Required (string)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* GET /api/reports */}
        <Card className="bg-black/20 border-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-400">List Attack Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Endpoint</h3>
              <code className="bg-black/40 px-2 py-1 rounded text-green-300">
                GET /api/reports
              </code>
            </div>

            <div>
              <h3 className="font-semibold text-green-400 mb-2">Response</h3>
              <pre className="bg-black/40 p-4 rounded overflow-x-auto">
                <code className="text-green-300">
                  {JSON.stringify([exampleResponse], null, 2)}
                </code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-green-400">Details</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300/80">
                <li>Returns the 100 most recent attack reports</li>
                <li>Sorted by creation date in descending order</li>
                <li>No authentication required</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Error Responses */}
        <Card className="bg-black/20 border-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-400">Error Responses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-green-400">Common Error Codes</h3>
              <ul className="list-disc list-inside space-y-2 text-green-300/80">
                <li><code className="text-green-400">400</code>: Missing or invalid fields</li>
                <li><code className="text-green-400">500</code>: Internal server error</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-400 mb-2">Example Error Response</h3>
              <pre className="bg-black/40 p-4 rounded overflow-x-auto">
                <code className="text-green-300">
                  {JSON.stringify({
                    error: "Missing required fields"
                  }, null, 2)}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 
