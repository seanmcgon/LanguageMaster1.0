//This is just an example component for testing assignment links, it'll be replaced by Suhani's page
import React from "react";
import { useParams } from "react-router-dom";

export default function AsgmtPage(props) {
  const { name } = useParams();

  return (
    <>
      <span>Assignment name: {name}</span>
    </>
  );
}
