const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-300 ">
      <div className="py-2">
        <div className="flex flex-col md:flex-row items-center justify-center md:gap-4">
          <div className="flex items-center">
            <img
              src="/nuevoLogoLargo.webp"
              alt="Logo de Too-Red"
              className="h-6 md:h-10"
            />
            <p className="text-gray-600 text-center text-xs">© {year}.</p>
          </div>
          <p className="text-gray-600 text-center text-xs">
            Antonio Gómez Domínguez. Desde Andalucía, con ❤
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
