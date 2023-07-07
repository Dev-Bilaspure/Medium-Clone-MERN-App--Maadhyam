import { tagsArray } from "@/constants";
import { Button } from "@mui/material";
import _ from "lodash";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const TagsTabs = (props) => {
  const [showAll, setShowAll] = React.useState(false);
  const navigate = useNavigate();
  return (
    <div className={twMerge(`flex flex-col space-y-0 `, props.className)}>
      <p className="font-outfit text-[24px] font-bold text-[#3c3c3c] sm:text-[21px]">
        Tags
      </p>
      <div className={`${"h-full"}`}>
        <div
          className={`${
            !showAll
              ? "h-[365px] overflow-hidden md:h-[310px] sm:h-[300px]"
              : "h-full"
          }`}
        >
          {tagsArray.map((tag) => {
            return (
              <Button
                variant="contained"
                style={{
                  marginRight: 23,
                  marginTop: 23,
                  backgroundColor: "#E8E8E8",
                  color: "black",
                  textTransform: "none",
                  borderRadius: 100,
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: 2,
                  paddingBottom: 2,
                  border: "1px solid #E6E6E6",
                  // boxShadow: 'none'
                }}
                onClick={() => navigate(`/tag/${tag}`)}
              >
                <p className="text-[13px] sm:text-[11px]">
                  {_.capitalize(tag)}
                </p>
              </Button>
            );
          })}
        </div>
        <div className="mt-1 flex justify-center">
          <Button
            variant="text"
            color="success"
            style={{
              textTransform: "none",
              minWidth: 0,
              padding: 0,
              height: "fit-content",
            }}
            onClick={() => setShowAll(!showAll)}
          >
            <p className="font-medium text-[#2E7D32]">
              {showAll ? "show less" : "show more"}
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TagsTabs;
