export interface UserData {
    id: number;
    name: string;
    email: string;
    password: string;
}

export const user: UserData[] = [
    {
        id: 1,
        name: "Dheeraj Kumar",
        email: "dheeraj1@example.com",
        password: "Password@123"
    },
    {
        id: 2,
        name: "Rahul Sharma",
        email: "rahul2@example.com",
        password: "Rahul@123"
    },
    {
        id: 3,
        name: "Aman Verma",
        email: "aman3@example.com",
        password: "Aman@123"
    },
    {
        id: 4,
        name: "Priya Singh",
        email: "priya4@example.com",
        password: "Priya@123"
    },
    {
        id: 5,
        name: "Rohit Kumar",
        email: "rohit5@example.com",
        password: "Rohit@123"
    },
    {
        id: 6,
        name: "Anjali Gupta",
        email: "anjali6@example.com",
        password: "Anjali@123"
    },
    {
        id: 7,
        name: "Vikash Yadav",
        email: "vikash7@example.com",
        password: "Vikash@123"
    },
    {
        id: 8,
        name: "Neha Kumari",
        email: "neha8@example.com",
        password: "Neha@123"
    },
    {
        id: 9,
        name: "Aditya Raj",
        email: "aditya9@example.com",
        password: "Aditya@123"
    },
    {
        id: 10,
        name: "Sneha Mishra",
        email: "sneha10@example.com",
        password: "Sneha@123"
    }
];

export const registerUser = (data: UserData): void => {
    user.push(data);
    return
}