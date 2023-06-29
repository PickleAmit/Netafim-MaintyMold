const formatDate = (props) => {
    const date = new Date(props);
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Israel",
    };
    return date.toLocaleDateString("he-IL", options);
  };

  export default formatDate