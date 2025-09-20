import pandas as pd
import csv

def search_csv_column():
    # Path to the CSV file
    csv_file_path = "/workspaces/AI-No-code/src/data/Manu (1).csv"
    
    # The text to search for in the 3rd column
    search_text = "Product Design and Development,  Product Design (CAD, Simulation, Prototyping),  AIpowered digital twins, Accelerated product development and optimized testing processes"
    
    try:
        # Read the CSV file
        df = pd.read_csv(csv_file_path)
        
        # Print column names to understand the structure
        print("Column names:")
        for i, col in enumerate(df.columns):
            print(f"Column {i+1}: {col}")
        print("\n" + "="*80 + "\n")
        
        # Get the 3rd column (index 2)
        if len(df.columns) >= 3:
            third_column = df.columns[2]
            print(f"Searching in column: '{third_column}'")
            print(f"Search text: '{search_text}'")
            print("\n" + "="*80 + "\n")
            
            # Search for rows containing the text in the 3rd column
            # Using case-insensitive search and handling potential whitespace issues
            matching_rows = df[df[third_column].astype(str).str.contains(
                search_text.replace(" ", "").replace(",", ""), 
                case=False, 
                na=False
            )]
            
            if not matching_rows.empty:
                print(f"Found {len(matching_rows)} matching row(s):")
                print("\n" + "="*80 + "\n")
                
                for index, row in matching_rows.iterrows():
                    print(f"Row {index + 2}:")  # +2 because pandas is 0-indexed and CSV has header
                    for col_name in df.columns:
                        print(f"{col_name}: {row[col_name]}")
                    print("\n" + "-"*80 + "\n")
            else:
                print("No exact matches found. Let me try a more flexible search...")
                
                # Try searching for key parts of the text
                keywords = ["Product Design and Development", "Product Design", "CAD", "Simulation", "Prototyping", "digital twins"]
                
                for keyword in keywords:
                    keyword_matches = df[df[third_column].astype(str).str.contains(
                        keyword, 
                        case=False, 
                        na=False
                    )]
                    
                    if not keyword_matches.empty:
                        print(f"Found {len(keyword_matches)} row(s) containing '{keyword}':")
                        for index, row in keyword_matches.iterrows():
                            print(f"Row {index + 2}:")
                            for col_name in df.columns:
                                print(f"{col_name}: {row[col_name]}")
                            print("\n" + "-"*40 + "\n")
                        break
                else:
                    print("No matches found even with flexible search.")
        
        else:
            print("Error: CSV file doesn't have at least 3 columns")
            
    except FileNotFoundError:
        print(f"Error: File '{csv_file_path}' not found")
    except Exception as e:
        print(f"Error reading CSV file: {str(e)}")

def search_csv_alternative():
    """Alternative method using manual CSV reading for better control"""
    csv_file_path = "/workspaces/AI-No-code/src/data/Manu (1).csv"
    search_text = "Product Design and Development,  Product Design (CAD, Simulation, Prototyping),  AIpowered digital twins, Accelerated product development and optimized testing processes"
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            header = next(csv_reader)  # Read header
            
            print("CSV Header:")
            for i, col in enumerate(header):
                print(f"Column {i+1}: {col}")
            print("\n" + "="*80 + "\n")
            
            row_number = 2  # Starting from 2 because of header
            found_matches = False
            
            for row in csv_reader:
                if len(row) >= 3:  # Ensure row has at least 3 columns
                    third_column_value = row[2] if len(row) > 2 else ""
                    
                    # Check if the search text is in the 3rd column
                    if search_text.lower().replace(" ", "") in third_column_value.lower().replace(" ", ""):
                        found_matches = True
                        print(f"EXACT MATCH found in Row {row_number}:")
                        for i, value in enumerate(row):
                            col_name = header[i] if i < len(header) else f"Column_{i+1}"
                            print(f"{col_name}: {value}")
                        print("\n" + "-"*80 + "\n")
                
                row_number += 1
            
            if not found_matches:
                print("No exact matches found. Searching for partial matches...")
                # Reset file pointer and search for partial matches
                file.seek(0)
                next(csv_reader)  # Skip header again
                row_number = 2
                
                keywords = ["Product Design and Development", "Product Design", "CAD", "Simulation", "Prototyping"]
                
                for row in csv_reader:
                    if len(row) >= 3:
                        third_column_value = row[2] if len(row) > 2 else ""
                        
                        for keyword in keywords:
                            if keyword.lower() in third_column_value.lower():
                                print(f"PARTIAL MATCH ('{keyword}') found in Row {row_number}:")
                                for i, value in enumerate(row):
                                    col_name = header[i] if i < len(header) else f"Column_{i+1}"
                                    print(f"{col_name}: {value}")
                                print("\n" + "-"*40 + "\n")
                                break
                    
                    row_number += 1
                        
    except FileNotFoundError:
        print(f"Error: File '{csv_file_path}' not found")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    print("Method 1: Using Pandas")
    print("="*50)
    search_csv_column()
    
    print("\n\nMethod 2: Using Manual CSV Reading")
    print("="*50)
    search_csv_alternative()
