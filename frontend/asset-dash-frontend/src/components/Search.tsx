import { useState } from "react";
import { Input } from "@/components/ui/input"
import { AiOutlineSearch } from 'react-icons/ai';

type Props = {
    placeholder?: string;
    onSearch?: (value: string) => void;
}
export const Search = ({ placeholder, onSearch }: Props) => {
  const [value, setValue] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && value !== "") {
      onSearch?.(value);
    }
  };

  return (
    <div className="flex gap-2 items-center p-1 w-[250px] border-[1px] dark:border-none rounded-md h-fit">
      <AiOutlineSearch fontSize={30} />
      <Input type="search" placeholder={placeholder}
        className="outline-none border-none" 
        onKeyDown={handleKeyDown} 
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}