import Layout2 from '@/app/sucesso/layoutWhite';
import Image from 'next/image';
import Link from 'next/link';

export default function Final() {
  return (
    <div className="max-w-[95%] w-[500px] mx-auto">
      <div className="flex justify-center mb-7 w-4/5 mx-auto">
        <Image
          src={'/melhoresdoano.png'}
          width={250}
          height={250}
          alt="Melhores do Ano"
          style={{ width: 'auto', height: '100px' }}
        />
      </div>
      <div className="w-full flex justify-center -mt-5">
        <h2 className="font-bold text-center">
          Prêmio oficial do Comércio mais barato da Bahia
        </h2>
      </div>
      <div className="mt-10 mx-auto">
        <h2>
          Bem-vindo a votação do prêmio{' '}
          <span className="font-bold">MELHORES DO ANO 2025</span> de Santo
          Antônio de Jesus
        </h2>
      </div>
      <div className="mt-10">
        <div>
          <h2 className="text-center">
            A votação chegou ao fim! 🌟 Fique ligado nas nossas redes para
            conhecer os grandes vencedores! 🎉
          </h2>
          <div className="flex justify-between mx-auto mt-4 max-w-28">
            <Link
              href={'https://www.instagram.com/melhoresdoanosaj/'}
              target="_blank"
            >
              <Image
                src={'/instagram.png'}
                width={45}
                height={45}
                alt="Instagrem"
                style={{ width: 'auto', height: '35px' }}
              />
            </Link>
            <Link href={'https://espacoempresarialsaj.com.br/'} target="_blank">
              <Image
                src={'/web.png'}
                width={45}
                height={45}
                alt="site"
                style={{ width: 'auto', height: '35px' }}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Layout2 />
      </div>
    </div>
  );
}
