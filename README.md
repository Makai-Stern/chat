# Chat
Made with REACT (Ant Design), Python (Fast API), Socket IO, SQL (SQLAlchemy)

![chat-app](https://user-images.githubusercontent.com/41600750/161624601-3be53010-b652-4de0-8315-c90c91c719f3.PNG)

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the necessary packages.

```bash
cd ./api
pip install -r requirements.txt
```

## Usage

**API:**

Create a .env file in the "api" directory, with the following variables:

| DB_URI="sqlite:///./database/data.db" |
| -------------------------------------------- |
| APP_NAME="Messenger"                         |
| DEBUG_MODE=True                              |
| HOST='0.0.0.0'                               |
| PORT=8000                                    |
| secret='your_secret_key'                     |
| algorithm=HS256                              |
| DOMAIN='http://0.0.0.0:8000/'                |

```python
python run.py
```

**Socket:**
```bash
cd ./socket
npm i
npm start
```

**Client:**
```bash
cd ./client
npm i
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
