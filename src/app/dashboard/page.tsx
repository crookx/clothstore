import { redirect } from 'next/navigation';

export default async function DashboardRedirect() {
  return redirect('/admin/dashboard');
}