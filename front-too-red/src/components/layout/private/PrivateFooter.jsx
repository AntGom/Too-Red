const PrivateFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 mb-2 text-center text-gray-600">
      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center justify-center">
          <img
            src="/nuevoLogoLargo.webp"
            alt="Logo de Too-Red"
            className="h-5 md:h-6"
          />
          <p className="text-xs mx-auto">© {year}</p>
        </div>

        <p className="text-xs mx-auto">Antonio Gómez Domínguez.</p>
        <p className="text-xs mx-auto">Desde Andalucía, con ❤</p>
      </div>
    </footer>
  );
};

export default PrivateFooter;
