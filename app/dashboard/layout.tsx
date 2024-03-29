'use client'

import AvatarDemo from "@/components/AvatarDemo";
import Sidenav from "./Sidenav";
import { Cross, CrossIcon, Menu, X } from "lucide-react";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { getUser } from "../getUser";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isOpened, setIsOpened] = useState(false)
    const [user, setUser] = useState("")
    const handleIsOpened = () => {
        setIsOpened(!isOpened)
    }
    async function fetchUser() {
        let name = await getUser()
        setUser(name ?? '')
    }
    useEffect(() => {
        fetchUser()
    }, [])
    return (
        <div className="h-screen flex">
            <Sidenav isOpened={isOpened} setIsOpened={handleIsOpened} />
            <div className="flex-1 md:ml-64">
                <div className="border-b border-b-secondary bg-background py-4 px-3 sm:px-8 sticky top-0 z-30">
                    <nav className='font-semibold rounded-md flex items-center justify-between md:justify-between gap-3'>
                        <button className="block md:hidden" onClick={() => setIsOpened(!isOpened)}>
                            {
                                isOpened ? <X></X> : <Menu></Menu>
                            }
                        </button>
                        <p>Welcome, <span className="text-primary font-semibold text-base">{user}</span></p>
                        <AvatarDemo />
                    </nav>
                </div>
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}