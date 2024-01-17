'use server'

import z, { string } from 'zod'
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt'
const { v4: uuidv4 } = require('uuid');


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    // const rawFormData = Object.fromEntries(formData.entries())
    // console.log(rawFormData)
    try {


        const { customerId, amount, status } = CreateInvoice.parse({
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
        });
        const amountInCents = amount * 100;
        const date = new Date().toISOString().split('T')[0];

        await sql`
        INSERT INTO invoices (customer_id, amount,status, date)
        VALUES  (${customerId}, ${amountInCents}, ${status}, ${date})
        `
    } catch (error) {
        return {
            message: "Cannot create invoice"
        }
    }

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, formData: FormData) {
    const UpdateInvoice = FormSchema.omit({ id: true, date: true });

    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    try {

        await sql`
        update invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id=${id}
        `
    } catch (error) {
        return { message: "Cannot update invoice" }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error("intentionally thrown ERROR!")
    console.log("deleted", id)
    try {

        await sql`
        DELETE FROM invoices WHERE id=${id}`
    } catch (error) {
        return { message: "Cannot delete invoice" }
    }
    revalidatePath('/dashboard/invoices')
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

export async function registerUser(prevState: string | undefined, formData: FormData) {

    const uniqueId = uuidv4();
    console.log("uniqueId", uniqueId);
    try {
        let email = formData.get('email')?.toString()
        let name = formData.get('name')?.toString() ?? ''
        let password = formData.get('password')?.toString() ?? ''
        let confirmPassword = formData.get('confirmPassword')?.toString() ?? ''

        if (password !== confirmPassword) return "Passwords do not match"
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await sql`
            select * from USERS where email=${email};
        `
        if (user.rowCount) {
            return "Email already taken"
        }
        // console.log("exixts", user.rowCount)
        const newUser = await sql
            `
            INSERT INTO users VALUES(${uniqueId},${name},${email},${hashedPassword})
            ON CONFLICT (id) DO NOTHING;
        `
        console.log(newUser)
        return "User registered successfully"
    } catch (error) {
        if (error) {
            return "Something went wrong"
        }
        throw error

    }
}
