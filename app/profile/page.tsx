import ProfileForm from "@/components/profile-form";

export default function Profile() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-4/6 rounded-md p-8 shadow-md">
        <h1 className="mb-4 text-3xl font-semibold">Update Profile</h1>
        <ProfileForm />
      </div>
    </div>
  );
}
