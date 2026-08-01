const Badge = ({ count }) => {
  return (
    <>
      {count > 0 && (
        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#A37CFF] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </>
  );
};

export default Badge;
