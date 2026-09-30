import ResourcePage from "./ResourcePage";

export default function SplitExpenses() {
  return (
    <ResourcePage
      resource="split-expenses"
      title="Split Expenses"
      subtitle="Keep shared spending simple and transparent."
      fields={["title", "totalAmount", "members"]}
    />
  );
}
