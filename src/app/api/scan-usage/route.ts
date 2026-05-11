import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'ここにAPIキーを貼り付け') {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY が設定されていません' }, { status: 500 })
  }

  const { imageBase64, mimeType } = await request.json()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: imageBase64 },
            },
            {
              type: 'text',
              text: `この画像は介護施設の月次消耗品使用量記録表です。
表から品目名と使用数量を読み取り、以下のJSON形式のみで返してください（説明文は不要です）：

{"items": [{"name": "品目名", "quantity": 数量}, ...]}

注意：
- 数量は整数で返してください
- 品目名は画像に記載されている通りに返してください
- 合計・小計・ヘッダー行は含めないでください
- 数量が0または空欄の品目は除いてください`,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ error: `API エラー: ${err}` }, { status: 500 })
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON が見つかりません')
    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch {
    return NextResponse.json({ error: '読み取り結果の解析に失敗しました', raw: text }, { status: 500 })
  }
}
