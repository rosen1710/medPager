from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_code_from_ai(symptoms):
    response = client.responses.create(
        model="gpt-4o-mini",
        instructions="Give only the appropriate ICD-10 medical codes (if more than one is possible, print them on separate lines). The output line must be like this: code, doctor/department specialty - description",
        input=f"Can you tell me which code stands for this problem: {symptoms}"
    )

    # print(response)
    # print(response.output_text)

    output = response.output_text
    problems = output.split("\n")

    result_list = []

    for case in problems:
        try:
            result_list.append({
                "code": case.split(", ")[0].strip(),
                "department": case.split(", ")[1].split(" - ")[0].strip(),
                "description": case.split(" - ")[1].strip()
            })
        except:
            pass

    return result_list

if __name__ == "__main__":
    print(get_code_from_ai(input("Input medical problem: ")))