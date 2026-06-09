import { Camera } from "lucide-react";
import { motion } from "motion/react";
function App() {
  return (
    <>
      <div className="text-3xl font-bold underline">
        <h1>Circuit Theory Analyzer</h1>
        <p>Ready to build!</p>
      </div>

      <motion.div animate={{ rotate: 360 }} transition={{ duration: 100 }}>
        <Camera className="w-6 h-6 text-gray-500" />
      </motion.div>
    </>
  );
}

export default App;
