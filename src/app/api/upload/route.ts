import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getUploadUrl } from "@/lib/s3";


export async function POST(req: Request) {
  if (!process.env.S3_ACCESS_KEY_ID) {
    return NextResponse.json({ error: "File storage is not configured yet. Please set up S3/R2." }, { status: 503 });
  }

  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, contentType, purpose } = await req.json();

  if (!fileName || !contentType) {
    return NextResponse.json({ error: "fileName and contentType required" }, { status: 400 });
  }

  const ext = fileName.split(".").pop();
  const key =
    purpose === "thumbnail"
      ? `thumbnails/${session.user.id}/${crypto.randomUUID()}.${ext}`
      : purpose === "preview"
        ? `previews/${session.user.id}/${crypto.randomUUID()}.${ext}`
        : `deliverables/${session.user.id}/${crypto.randomUUID()}.${ext}`;

  const uploadUrl = await getUploadUrl(key, contentType);

  return NextResponse.json({ uploadUrl, key });
}
