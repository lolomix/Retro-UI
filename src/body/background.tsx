import BackgroundImg from "../assets/background/bg-all.jpg";
import Canvas from "./canvas";
export default function App() {
  return (
    <div className="background no-anim">
      <Canvas />
      <img className="layer bg" src={BackgroundImg} />
    </div>
  );
}
