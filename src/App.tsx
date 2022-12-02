import Search from './components/Search';
function App() {
  return (
    <main className='bg-[#1e243d] box-border h-screen w-screen'>
      <div className='container mx-auto pt-32'>
        <h1 className='text-6xl text-white font-bold text-center py-8'>AI Search</h1>
        <p className='text-center text-white mb-8'> Demonstrating path finding algorithms</p>
        <Search />
      </div>
    </main>
  );
}

export default App;
