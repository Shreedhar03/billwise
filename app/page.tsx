import { ModeToggler } from "@/components/ModeToggler"
import Image from "next/image"
import Link from "next/link"
import home from '../public/home.svg'

export default function Home() {
  return (
    <>
      <main className='max-w-6xl mx-6 xl:mx-auto flex md:flex-row flex-col items-center justify-center gap-12 my-12 md:my-0 sm:h-screen'>
        <div className="flex flex-col gap-4 items-start">
          <h1 className="logo text-2xl ">BillWise<span className="text-primary text-4xl font-semibold">.</span></h1>
          <h3 className="text-2xl font-semibold text-primary">INVENTORY MADE EASY</h3>
          <p>Easily organize and track all your invoices in one place. Stay on top of your transactions effortlessly, ensuring a smooth and organized workflow. Try it now and experience the convenience of hassle-free invoice management!</p>
          <Link href={'dashboard'} className="bg-primary text-background font-semibold px-3 py-2 rounded-lg">Get Started</Link>
        </div>
        <Image src={home} alt="home" className="w-96" />
      </main>

    </>
  )
}
