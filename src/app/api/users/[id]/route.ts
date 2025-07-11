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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id: paramId } = params;
  const id = parseInt(paramId, 10);
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id: paramId } = params;
    const id = parseInt(paramId, 10);
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
