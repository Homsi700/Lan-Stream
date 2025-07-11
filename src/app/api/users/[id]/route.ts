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

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    const users = readUsers();
    const user = users.find(u => u.id === id);
    if (user) {
        return NextResponse.json(user);
    }
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const updatedUserData = await request.json();
  let users = readUsers();
  
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex > -1) {
    // Prevent changing username to one that already exists (and is not the current user)
    if (users.some(user => user.username === updatedUserData.username && user.id !== id)) {
        return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }
    users[userIndex] = { ...users[userIndex], ...updatedUserData, id: id }; // Ensure ID remains the same
    writeUsers(users);
    return NextResponse.json(users[userIndex], { status: 200 });
  } else {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  let users = readUsers();
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);

  if (users.length < initialLength) {
    writeUsers(users);
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id:string } }) {
    const id = parseInt(params.id, 10);
    const { status } = await request.json();
    let users = readUsers();
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex > -1) {
        users[userIndex].status = status;
        writeUsers(users);
        return NextResponse.json(users[userIndex], { status: 200 });
    } else {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
}
