import React from "react";
import api from "../../Api/Api";
import CategoryList from "../CategoryList";
import { ReactComponent as WhatsAppIcon } from "../../assets/icons/whatsapp.svg";

const Ballot = () => {
  const [ballot, setBallot] = React.useState([]);
  const [selections, setSelections] = React.useState({});
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    api
      .getBallotData()
      .then((data) => {
        console.log(data, "ballot Data");
        setBallot(data.items);
      })
      .catch((err) => {
        console.log(err, "error");
      });
  }, []);

  const handleSelect = (categoryTitle, selectedItem) => {
    setSelections((prevS) => ({ ...prevS, [categoryTitle]: selectedItem }));
  };

  const completedVoting = () => {
    return Object.keys(selections).length === ballot.length;
  };

  const submitResult = () => {
    // make post request and done
    setOpen(true);
    setSelections({});
  };

  const handleRandomSelect = () => {
    ballot.forEach((bal) => {
      const { id, items } = bal;
      setSelections((prevS) => ({
        ...prevS,
        [id]: items[parseInt(Math.random() * items.length)].title,
      }));
    });
  };

  return (
    <div className="ballot">
      <button className="btn" onClick={handleRandomSelect}>
        Random Select
      </button>

      <ul className="container">
        {ballot.map(({ id, title, items }) => (
          <div key={id} className="category">
            <h3 className="category-name">{title}</h3>

            <CategoryList
              items={items}
              categoryTitle={id}
              handleSelect={handleSelect}
              selections={selections}
            />
          </div>
        ))}
      </ul>
      <div className="btn-container">
        <button
          disabled={!completedVoting()}
          onClick={submitResult}
          className="btn"
        >
          Submit
        </button>
      </div>

      <WhatsAppIcon />

      {open && (
        <div className="modal">
          <dialog open className="dialog">
            <p className="close" onClick={() => setOpen(false)}>
              X
            </p>
            <h3 className="title">Success</h3>
            <p className="text">Thank you for voting. We appreciate you.</p>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default Ballot;
