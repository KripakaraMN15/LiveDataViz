import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const DropdownContext = ({ options = [], disable, onSelect, children }) => {
    if (disable) return <Fragment>{children}</Fragment>;

    return (
        <Menu as="span" className="relative block text-left">
            <Menu.Button className="block w-full text-left">{children}</Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute left-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-slate-900 shadow-xl ring-1 ring-slate-700 ring-opacity-50 focus:outline-none">
                    <div className="py-1">
                        {options.map((option, index) => (
                            <Menu.Item key={option.value}>
                                {(p) => (
                                    <span
                                        className={classNames(
                                            p.active ? "bg-slate-700 text-white" : "text-slate-200 hover:bg-slate-800",
                                            "block px-4 py-2 text-sm cursor-pointer transition-colors"
                                        )}
                                        onClick={() => {
                                            onSelect && !disable && onSelect(option.value, index);
                                        }}
                                    >
                                        {option.label}
                                    </span>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default DropdownContext;
