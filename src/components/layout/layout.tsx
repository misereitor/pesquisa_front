import Image from 'next/image';
import melgores from '/public/melhoresdoano.png';
import espaco from '/public/espaco.png';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="border-b-2 border-white border-opacity-10 fixed w-full top-0 overflow-hidden bg-black z-50 layout-page">
        <div className="flex justify-around m-3 max-w-[500px] mx-auto">
          <Image
            className="-mr-10"
            src={espaco}
            alt={'Logo Espaco Empresarial'}
            width={100}
            height={67.57}
            style={{ width: 'auto', height: '50px' }}
          />
          <Image
            className="-mr-5"
            src={melgores}
            alt={'Logo Melhores do ano'}
            width={100}
            height={67.57}
            style={{ width: 'auto', height: '50px' }}
          />
        </div>
      </div>
      <div className="mt-[90px] layout-page-children">{children}</div>
    </main>
  );
}
