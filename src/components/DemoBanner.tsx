export default function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO !== '1') return null;

  return (
    <div
      role="status"
      className="w-full bg-amber-100 text-amber-900 text-xs text-center py-1 px-3"
    >
      Modo demonstração: dados fictícios (login: vendedor@teste.com / senha123)
    </div>
  );
}
