import AvatarDemo from "@/components/AvatarDemo";
import Sidenav from "./Sidenav";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex">
            <Sidenav />
            <div className="flex-1 md:ml-64">
                <div className="bg-card py-4 px-8">
                    <h1 className='font-semibold rounded-md flex items-center justify-end gap-3'>
                        <AvatarDemo />
                    </h1>
                </div>
                <main className="md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}