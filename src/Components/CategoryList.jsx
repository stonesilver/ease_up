const CategoryList = ({ items, categoryTitle, handleSelect, selections }) => {
  return (
    <div className="category-container">
      {items.map(({ id, photoUrL, title }) => (
        <div
          key={id}
          className={`card ${
            selections[categoryTitle] === title ? "active-card" : ""
          }`}
          onClick={() => handleSelect(categoryTitle, title)}
        >
          <img src={photoUrL} alt="hgsdjhsh" className="img" />
          <p className="title">{title}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
