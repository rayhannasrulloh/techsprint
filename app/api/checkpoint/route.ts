// File: src/app/api/checkpoint/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { teamId, checkpointNumber, reportText, githubLink } = body;

        // Insert data into the checkpoints table
        const { data, error } = await supabase
            .from('checkpoints')
            .insert([
                {
                    team_id: teamId,
                    checkpoint_number: checkpointNumber,
                    report_text: reportText,
                    github_link: githubLink
                }
            ])
            .select();

        if (error) {
            console.error("Database Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("Checkpoint saved:", data);
        return NextResponse.json({ message: "Checkpoint successfully submitted!", data: data }, { status: 200 });

    } catch (err) {
        console.error("Server Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Output: When triggered by frontend, returns HTTP 200 JSON response with inserted data.