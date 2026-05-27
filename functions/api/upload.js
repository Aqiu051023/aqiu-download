export async function onRequestPost({ request }) {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) return new Response("No file", { status: 400 });

    // ========== 你的信息（已自动填好）==========
    const GITHUB_TOKEN = "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";
    const OWNER = "aqiu051023";
    const REPO = "aqiu-download";
    const BRANCH = "main";
    // ========================================

    const bytes = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));

    const path = encodeURIComponent(file.name);
    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

    try {
        await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `上传 ${file.name}`,
                content: base64,
                branch: BRANCH
            })
        });

        return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false }), { status: 500 });
    }
}