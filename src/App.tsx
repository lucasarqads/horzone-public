import { Navbar } from './components/sections/Navbar'
import { HeroSobre } from './components/sections/HeroSobre'
import { Sobre } from './components/sections/Sobre'
import { Repertorio } from './components/sections/Repertorio'
import { Plano } from './components/sections/Plano'
import { Adicionais } from './components/sections/Adicionais'
import { Chamada } from './components/sections/Chamada'
import { Footer } from './components/sections/Footer'
import { WhatsappFlutuante } from './components/ui/WhatsappFlutuante'
import { useLenis } from './lib/useLenis'

export default function App() {
  useLenis()

  return (
    <>
      <Navbar />
      <main>
        <HeroSobre />
        <Sobre />
        <Repertorio />
        <Plano />
        <Adicionais />
        <Chamada />
      </main>
      <Footer />
      <WhatsappFlutuante />
    </>
  )
}
