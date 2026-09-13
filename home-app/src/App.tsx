import { ApartmentScene } from './components/apartment/ApartmentScene'
import { Overlay } from './components/ui/Overlay'

export default function App() {
  return (
    <div className="relative h-full w-full">
      <ApartmentScene />
      <Overlay />
    </div>
  )
}
