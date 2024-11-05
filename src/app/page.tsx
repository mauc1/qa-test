'use client';
import { useRouter } from 'next/navigation';



export default function Home() {
  const router = useRouter();
  // Redireccionar al endpoint /login
  router.push('/login');
  return (
    <br />
  );
}
