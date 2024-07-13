import { IoSearch } from "react-icons/io5";
import "./searchbox.css";
import React from "react";

type Props = {
  // 검색값, 변경함수(핸들러), 제출값
  searchValue: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox({ searchValue, onChange, onSubmit }: Props) {
  return (
    <div>
      <form className="searchbox-form" onSubmit={onSubmit}>
        <input
          className="searchbox-input"
          type="text"
          placeholder="위치를 입력하세요"
          onChange={onChange}
          value={searchValue}
        />
        <button className="searchbox-button">
          <IoSearch />
        </button>
      </form>
    </div>
  );
}
