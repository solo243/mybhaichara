import React from "react";
import Card from "./Card";

const CardContiner = ({ data = [] }) => {
  const list = Array.isArray(data) ? data : [];

  return (
    <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {list.map((item, index) => (
        <Card key={item?._id || item?.id || index} data={item} />
      ))}
    </div>
  );
};

export default CardContiner;
