import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');

const readUsers = (): any[] => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsers = (users: any[]) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

export async function GET() {
  const users = readUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const newUser = await request.json();
  const users = readUsers();
  
  if (users.some(user => user.username === newUser.username) || newUser.username === 'admin') {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }

  users.push(newUser);
  writeUsers(users);
  return NextResponse.json(newUser, { status: 201 });
}
