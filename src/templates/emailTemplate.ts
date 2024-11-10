export const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-image: url('{{backgroundUrl}}'); background-size: cover; padding: 40px 20px; text-align: center; }
        .logo { max-width: 150px; height: auto; }
        .content { padding: 40px 20px; background: #ffffff; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{logoUrl}}" alt="{{name}}" class="logo">
        </div>
        <div class="content">
            {{welcomeMessage}}
        </div>
        <div class="footer">
            <p>{{name}}</p>
            <p>{{address}}</p>
            <p>{{phone}}</p>
            <p>&copy; {{year}} All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;