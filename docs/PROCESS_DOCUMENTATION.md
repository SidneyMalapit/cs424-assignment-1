# process and documentation

## T1: Observing my daily commute to class

### Four inital questions
- How might trends manifest in the data I collect about my
  transit to/from campus?
- How might external factors affect my transit?
- Will the data reveal something about my commute habits? Or
  possibly some external factors that impact my ride?
- How much time will I usually spend on campus?

I plan to collect data about my commute to and from campus

- **Over how many locations, times, or days will you collect
  it?**
    - probably not over too many locations, but over many days
      and times
- **How will you decide what to observe?**
    - whatever comes to mind/is an easy or obvious attribute to
      record
- **What might your collection process fail to capture?**
    - specific events that impact the duration of my commute
- **How might your collection process introduce bias?**
    - might forget to record some times and thus introduce a
      temporal offset in the data

Since I have Google Sheets installed on my phone, I'll be using
that to easily record data items from my commute.

[**Data collection spreadsheet**](https://docs.google.com/spreadsheets/d/1-2Z2D2LUQVXEo4_aCibJcYbf_6ATQ67Pk72uiq38kME/edit?usp=sharing)

### Attributes to collect

**Commute timestamps**
|attribute|type|description|example|
|---|---|---|---|
|day|temporal|Date of collection|2026-09-14|
|leave\_home|temporal|Time of departure from house|08:13 AM|
|arrive\_school|temporal|Time of departure from last public transportation vehicle (bus, train) to campus<br><br>(ex. if I were to take the Blue Line to campus, I mark the time I take the first step onto the UIC-Halsted Blue Line platform)|9:23 AM|
|leave\_school|temporal|Time of arrival at station for first form of public transportation to get home<br><br>(ex. if I were to take the Blue Line home, I mark the time I first get to the UIC-Halsted Blue Line platform)|04:10 PM|
|arrive\_home|temporal|Time of arrival at house|05:33 PM|
|notes|n/a|What happened that day that may have affected my usual schedule (for my own journal purposes; not included in csv)|went out for sushi; train delayed multiple times|

### T2: Pilot collection

Here are my findings after doing some observations:

- **Were the attributes clear and easy to record?**
    - i only had to record timestamps so that wasn't too hard,
      but sometimes i would be tired after classes and forget to
      record the exact time when i get home, so i would estimate
    - figured out i could have my phone automatically record when
      i arrive at certain locations, so it helps if i sometimes
      forget to record the exact time, but has an offset of ~1-2
      minutes
- **Did the pilot change the kinds of questions you thought you
  could answer?**
    - i definitely felt like i wasn't getting enough data points,
      or at least not enough to generate sufficient questions
      using the data

After considering the above, I decided to collect data about the
vehicles I take. Attributes listed below:

**Public transport vehicle observations** 
|attribute|type|description|example|
|---|---|---|---|
|day|temporal|Date of collection|2026-09-14|
|order|quanitative|`N`th vehicle taken when commuting to/from campus|3|
|name|categorical|Name of the vehicle line taken|Blue Line|
|returning|categorical (boolean)|Whether this vehicle was taken to get home|False|
|destination|categorical|Name of the last stop the vehicle serves before going out of service or assuming a different route|Jefferson Park|
|model\_number|categorical|Model number of the vehicle taken|5233|
|route\_modifier|categorical|Label that marks an alternate route/destination that deviates from the vehicle's usual trip|5000 Express|

I originally wanted to collect the line authority (CTA, PACE) of
the vehicles I take, as well as whether they were a bus or train,
but I realized I could just make a lookup table for the table
above, which looks like this:

|attribute|type|description|example|
|---|---|---|---|
|name|categorical|Name of the line|290|
|authority|categorical|Transit authority that governs this line|PACE|
|vehicle\_type|categorical|Kind of vehicle|bus|

which can be joined on the public transport vehicle table.
