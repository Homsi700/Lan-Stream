import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const sessionsFilePath = path.join(process.cwd(), 'src', 'data', 'sessions.json');

interface Session {
    username: string;
    loggedInAt: string;
}

const readSessions = (): Session[] => {
  try {
    const data = fs.readFileSync(sessionsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
    }
    console.error("Error reading sessions file:", error);
    return [];
  }
};

const writeSessions = (sessions: Session[]) => {
  try {
    fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error("Error writing sessions file:", error);
  }
};

// GET all active sessions
export async function GET() {
  const sessions = readSessions();
  return NextResponse.json(sessions);
}

// POST to create a new session (on login)
export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
        return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    let sessions = readSessions();
    // Remove any existing session for this user to prevent duplicates
    sessions = sessions.filter(session => session.username !== username);

    const newSession: Session = {
      username,
      loggedInAt: new Date().toISOString(),
    };

    sessions.push(newSession);
    writeSessions(sessions);

    return NextResponse.json(newSession, { status: 201 });
  } catch(error) {
    console.error("Session POST error:", error);
    return NextResponse.json({ message: 'Failed to create session' }, { status: 500 });
  }
}

// DELETE to remove a session (on logout)
export async function DELETE(request: Request) {
   try {
    const { username } = await request.json();
     if (!username) {
        return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }
    
    let sessions = readSessions();
    const initialLength = sessions.length;
    sessions = sessions.filter(session => session.username !== username);

    if (sessions.length < initialLength) {
        writeSessions(sessions);
        return NextResponse.json({ message: 'Session deleted successfully' }, { status: 200 });
    } else {
        return NextResponse.json({ message: 'Session not found for the user' }, { status: 404 });
    }
   } catch (error) {
    console.error("Session DELETE error:", error);
    return NextResponse.json({ message: 'Failed to delete session' }, { status: 500 });
   }
}
