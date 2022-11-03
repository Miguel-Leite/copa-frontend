import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { ToastContainer, toast, useToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { IHomeProps } from '../interfaces/IHomeProps';

import { api } from '../lib/axios';

export default function Home(props: IHomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function createPool(e: FormEvent) {
    e.preventDefault()

    if (!poolTitle) {
      toast.error("Por favor preencha o formulário!")
      return;
    }

    try {
      const response = await api.post('pools', {
        title: poolTitle
      })

      const { code } = response.data

      setPoolTitle('')
      await navigator.clipboard.writeText(code);
      toast.success("Bolão criado com sucesso, o codigo foi copiado na área de transferência.")
    } catch (err) {
      toast.error("Falha ao criar o balão, tente novamente!")
    }
  }

  return (
    <div className='max-w-[1124px] mx-auto grid grid-cols-2 gap-28 items-center h-screen'>
      <main>
      <ToastContainer theme='colored' />
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilha entre os amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="NLW Copa" />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
            type="search"
            placeholder='Qual nome do seu bolão?'
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm outline-0 text-gray-50 focus:border-yellow-500'
          />

          <button
            type="submit"
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text2xl'>+{props.poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600' />
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text2xl'>+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel NLW Copa"
        quality={100}
      />
    </div>
  )
}

// export const getServerSideProps = async () =>{
//   const [
//     poolCountResponse, 
//     guessCountResponse, 
//     usersCountResponse
//   ] = await Promise.all([
//     api.get('pools/count'),
//     api.get('guesses/count'),
//     api.get('users/count'),
//   ])

//   return {
//     props: {
//       poolsCount: poolCountResponse.data.count,
//       guessesCount: guessCountResponse.data.count,
//       usersCount: usersCountResponse.data.count
//     }
//   }
// }

export const getStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, usersCountResponse] =
    await Promise.all([
      api("pools/count"),
      api("guesses/count"),
      api("users/count"),
    ]);

  return {
    props: {
      poolsCount: poolCountResponse.data.count,
      guessesCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};