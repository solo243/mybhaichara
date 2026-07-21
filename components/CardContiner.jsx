import React from "react";
import Card from "./Card";

const CardContiner = ({ data }) => {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item, index) => (
        <Card key={item?.id || index} data={item} />
      ))}
    </div>
  );
};

export default CardContiner;
