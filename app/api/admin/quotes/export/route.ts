import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { QuoteRequest } from '@/models/schemas';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = getAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    const quotes = await QuoteRequest.find().sort({ timestamp: -1 }).lean();

    // Generate CSV Header
    const csvHeaders = ['Name', 'Email', 'Phone', 'Subject', 'Service Interest', 'Message', 'Submission Time', 'Status'];
    
    // Format rows
    const csvRows = quotes.map(q => {
      const row = [
        q.name || '',
        q.email || '',
        q.phone || '',
        q.subject || '',
        q.serviceInterest || '',
        (q.message || '').replace(/"/g, '""').replace(/\n/g, ' '), // escape quotes and newlines
        q.timestamp ? new Date(q.timestamp).toLocaleString('en-IN') : '',
        q.status || ''
      ];
      // Wrap values in quotes to handle commas
      return row.map(val => `"${val}"`).join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Create dynamic response with file download headers
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=quote_requests_' + Date.now() + '.csv',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('CSV Export API error:', error);
    return NextResponse.json({ error: error.message || 'CSV generation failed.' }, { status: 500 });
  }
}
