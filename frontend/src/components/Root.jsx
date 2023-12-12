import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id="root-container">
        <Outlet />
      </div>
    </>
  );
}