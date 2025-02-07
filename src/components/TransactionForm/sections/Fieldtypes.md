Field types and cell values

This documents all of the currently supported field types and their corresponding cell value formats, as well as their option formats.

Note: Webhooks have different cell payloads for some cell types (eg: single select). This will be detailed below.

Warning: We may add more field types in the future and this will not be considered a breaking change. API consumers are expected to handle unknown field types gracefully. Further, object definitions are not meant to exhaustively describe the shape, new properties can be added and will not be considered a breaking change.
Field types

    AI Text
    Attachment
    Auto number
    Barcode
    Button
    Checkbox
    Collaborator
    Count
    Created by
    Created time
    Currency
    Date
    Date and time
    Duration
    Email
    Formula
    Last modified by
    Last modified time
    Link to another record
    Long text
    Lookup
    Multiple collaborator
    Multiple select
    Number
    Percent
    Phone
    Rating
    Rich text
    Rollup
    Single line text
    Single select
    Sync source
    Url

AI Text

Long text (with AI output enabled)

AI generated text can depend on other cells in the same record and can be in a loading state.

Cell format (read only)
any of the below objects
state
	"empty" | "loading" | "generated"

The current state of the cell.
isStale
	boolean

If the cell should be recomputed due to a dependency change. This can either be a dependent field or the field configuration.
value
	string | null

The value that is shown to the user inside of the cell
state
	"error"

Whether the cell is currently in an error state.
errorType
	string

A short string that describes the error.
isStale
	boolean

If the cell should be recomputed due to a dependency change. This can either be a dependent field or the field configuration.
value
	string | null

The value that is shown to the user inside of the cell

Field type and options (read only)
type
	"aiText"
options
	object
prompt
	optional<array of (strings | the below object)>

The prompt that is used to generate the results in the AI field, additional object types may be added in the future. Currently, this is an array of strings or objects that identify any fields interpolated into the prompt.

The prompt will not currently be provided if this field config is within another fields configuration (like a lookup field)
field
	object
fieldId
	string
referencedFieldIds
	optional<array of strings>

The other fields in the record that are used in the ai field

The referencedFieldIds will not currently be provided if this field config is within another fields configuration (like a lookup field)
Attachment

Attachments allow you to add images, documents, or other files which can then be viewed or downloaded.

URLs returned will expire 2 hours after being returned from our API. If you want to persist the attachments, we recommend downloading them instead of saving the URL. See our support article for more information.

Cell format (read)
array of the below object
id
	string

Unique attachment id
type
	string

Content type, e.g. "image/jpeg"
filename
	string

Filename, e.g. "foo.jpg"
height
	number

Height, in pixels (these may be available if the attachment is an image)
size
	number

File size, in bytes
url
	string

url, e.g. "https://v5.airtableusercontent.com/foo".

URLs returned will expire 2 hours after being returned from our API. If you want to persist the attachments, we recommend downloading them instead of saving the URL. See our support article for more information.
width
	number

Width, in pixels (these may be available if the attachment is an image)
thumbnails
	object

These small, large, and full thumbnails may be available if attachment is an image or document
full
	optional<object>
url
	string

These may be available if the attachment is an image or document. See notes under url about the lifetime of these URLs.
height
	number
width
	number
large
	optional<object>
url
	string

These may be available if the attachment is an image or document. See notes under url about the lifetime of these URLs.
height
	number
width
	number
small
	optional<object>
url
	string

These may be available if the attachment is an image or document. See notes under url about the lifetime of these URLs.
height
	number
width
	number

Cell format (write)
array of any of the below objects

To create new attachments, provide the url and optionally filename.

You must also provide the id's for any existing attachment objects you wish to keep.

Note that in most cases the API does not currently return an error code for failed attachment object creation given attachment uploading happens in an asynchronous manner, such cases will manifest with the attachment object either being cleared from the cell or persisted with generated URLs that return error responses when queried. If the same attachment URL fails to upload multiple times in a short time interval then the API may return an ATTACHMENTS_FAILED_UPLOADING error code in the details field of the response and the attachment object will be cleared from the cell synchronously.

We also require URLs used to upload have the https:// or http:// protocol (Note: http:// support will be removed in the near future), have a limit of 3 max redirects, and a file size limit of 1GB. In addition, URLs must be publicly accessible, in cases where cookie authentication or logging in to access the file is required, the login page HTML will be downloaded instead of the file.
url
	string

url, e.g. "https://v5.airtableusercontent.com/foo".

URLs returned will expire 2 hours after being returned from our API. If you want to persist the attachments, we recommend downloading them instead of saving the URL. See our support article for more information.
filename
	optional<string>

Filename, e.g. "foo.jpg"
id
	string

When writing an attachment object, be sure to include all existing attachment objects by providing an id. This can be retrieved using the get record endpoint.

To remove attachments, include the existing array of attachment objects, excluding any that you wish to remove.

Field type and options
type
	"multipleAttachments"
options
	object
isReversed
	boolean

Whether attachments are rendered in the reverse order from the cell value in the Airtable UI (i.e. most recent first).

You generally do not need to rely on this option.
Auto number

Automatically incremented unique counter for each record.

Cell format (read only)
number

Field type and options (read only)
type
	"autoNumber"
Barcode

Use the Airtable iOS or Android app to scan barcodes.

Cell format

The barcode object may contain the following two properties, both of which are optional.
type
	optional<string | null>

Barcode symbology, e.g. "upce" or "code39"
text
	string

Barcode data

Field type and options
type
	"barcode"
Button

A button that can be clicked from the Airtable UI to open a URL or open an extension.

Cell format (read only)

Object providing details about the button configuration.
label
	string

Button label
url
	string | null

For "Open URL" actions, the computed url value

Field type and options (read only)
type
	"button"
Checkbox

Cell format
true

This field is "true" when checked and otherwise empty.

You can write to the cell with "false", but the read value will be still be "empty" (unchecked).

Field type and options

Bases on a free or plus plan are limited to using the 'check' icon and 'greenBright' color.
type
	"checkbox"
options
	object
color
	"greenBright" | "tealBright" | "cyanBright" | "blueBright" | "purpleBright" | "pinkBright" | "redBright" | "orangeBright" | "yellowBright" | "grayBright"

The color of the checkbox.
icon
	"check" | "xCheckbox" | "star" | "heart" | "thumbsUp" | "flag" | "dot"

The icon name of the checkbox.
Collaborator

A collaborator field lets you add collaborators to your records. Collaborators can optionally be notified when they're added (using the field settings in the UI). A single collaborator field has been configured to only reference one user collaborator.

Cell format (read)

Object providing details about the user collaborator in this field.
id
	string

User id or group id
email
	optional<string>

User's email address
name
	optional<string>

User's display name (may be omitted if the user hasn't created an account)
permissionLevel
	optional<"none" | "read" | "comment" | "edit" | "create">

User's collaborator permission Level

This is only included if you're observing a webhooks response.
profilePicUrl
	optional<string>

User's profile picture

This is only included if it exists for the user and you're observing a webhooks response.

Cell format (write)
any of the below objects
id
	string

The user id, group id of the user
email
	string

The user's email address

Field type and options
type
	"singleCollaborator"
options
	optional<object>
Count

Number of linked records, from a linked record field in the same table.

Cell format (read only)
number

Field type and options (read only)
type
	"count"
options
	object
isValid
	boolean

false when recordLinkFieldId is null, e.g. the referenced column was deleted.
recordLinkFieldId
	optional<string | null>
Created by

The collaborator who created the record.

Cell format (read only)

Object providing details about the user collaborator in this field.
id
	string

User id or group id
email
	optional<string>

User's email address
name
	optional<string>

User's display name (may be omitted if the user hasn't created an account)
permissionLevel
	optional<"none" | "read" | "comment" | "edit" | "create">

User's collaborator permission Level

This is only included if you're observing a webhooks response.
profilePicUrl
	optional<string>

User's profile picture

This is only included if it exists for the user and you're observing a webhooks response.

Field type and options (read only)
type
	"createdBy"
Created time

The time the record was created in UTC e.g. "2022-08-29T07:00:00.000Z" or "2022-08-29"

Cell format (read only)
string

Field type and options (read only)
type
	"createdTime"
options
	object
result
	optional<any of the below objects>

This will always be a date or dateTime field config.
Date field config
Date-time field config
Currency

Currency value. Symbol set with the field config.

Cell format
number

Field type and options
type
	"currency"
options
	object
precision
	number

Indicates the number of digits shown to the right of the decimal point for this field. (0-7 inclusive)
symbol
	string

Currency symbol to use.
Date

String (ISO 8601 formatted date)

UTC date, e.g. "2022-09-05".

Cell format
string

A date.

When reading from and writing to a date field, the cell value will always be an ISO 8601 formatted date. (Field options specify how it's formatted in the main Airtable UI - format can be used with moment.js to match that.)

The date format string follows the moment.js structure documented here.

When using the Airtable.js library you can also use a Date object.

Field type and options (read)
type
	"date"
options
	object
dateFormat
	object
format
	"l" | "LL" | "M/D/YYYY" | "D/M/YYYY" | "YYYY-MM-DD"

format is always provided when reading. (l for local, LL for friendly, M/D/YYYY for us, D/M/YYYY for european, YYYY-MM-DD for iso)
name
	"local" | "friendly" | "us" | "european" | "iso"

Field type and options (write)
type
	"date"
options
	object
dateFormat
	object
format
	optional<"l" | "LL" | "M/D/YYYY" | "D/M/YYYY" | "YYYY-MM-DD">

Format is optional when writing, but it must match the corresponding name if provided.

(l for local, LL for friendly, M/D/YYYY for us, D/M/YYYY for european, YYYY-MM-DD for iso)
name
	"local" | "friendly" | "us" | "european" | "iso"
Date and time

String (ISO 8601 formatted date)

UTC date and time, e.g. "2022-09-05T07:00:00.000Z".

Cell format
string

A date and time.

When reading from and writing to a date field, the cell value will always be an ISO 8601 formatted date. (Field options specify how it's formatted in the main Airtable UI - format can be used with moment.js to match that.)

When using the Airtable.js library you can also use a Date object.

When writing to a dateTime field configured with a non utc or client time zone like America/Los_Angeles, ambiguous string inputs like "2020-09-05T07:00:00" and "2020-09-08" will be interpreted according to the timeZone of the field instead of utc, and nonambiguous string inputs with zone offset like "2020-09-05T07:00:00.000Z" and "2020-09-08T00:00:00-07:00" will be interpreted correctly as the underlying timestamp.

Field type and options (read)
type
	"dateTime"
options
	object
timeZone
	Timezone
dateFormat
	object
format
	"l" | "LL" | "M/D/YYYY" | "D/M/YYYY" | "YYYY-MM-DD"

format is always provided when reading. (l for local, LL for friendly, M/D/YYYY for us, D/M/YYYY for european, YYYY-MM-DD for iso)
name
	"local" | "friendly" | "us" | "european" | "iso"
timeFormat
	object
format
	"h:mma" | "HH:mm"
name
	"12hour" | "24hour"

Field type and options (write)
type
	"dateTime"
options
	object
timeZone
	Timezone
dateFormat
	object
format
	optional<"l" | "LL" | "M/D/YYYY" | "D/M/YYYY" | "YYYY-MM-DD">

Format is optional when writing, but it must match the corresponding name if provided.

(l for local, LL for friendly, M/D/YYYY for us, D/M/YYYY for european, YYYY-MM-DD for iso)
name
	"local" | "friendly" | "us" | "european" | "iso"
timeFormat
	object
name
	"12hour" | "24hour"
format
	optional<"h:mma" | "HH:mm">
Duration

An integer representing number of seconds.

Cell format
number

Field type and options
type
	"duration"
options
	object
durationFormat
	"h:mm" | "h:mm:ss" | "h:mm:ss.S" | "h:mm:ss.SS" | "h:mm:ss.SSS"
Email

A valid email address.

Cell format
string

Field type and options
type
	"email"
Formula

Compute a value in each record based on other fields in the same record.

Cell format (read only)
string | number | true | array of (strings | numbers)

Computed value - Check options.result to know the resulting field type.

Field type and options (read only)
type
	"formula"
options
	object
formula
	string

The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) in the Airtable.com formula editor will be returned as LEFT(4, {fldXXX}) via API.
isValid
	boolean

false if the formula contains an error.
referencedFieldIds
	array of strings | null

All fields in the record that are used in the formula.
result
	Field type and options | null

The resulting field type and options returned by the formula. See other field type configs on this page for the possible values. Can be null if invalid.
Last modified by

Shows the collaborator who most recently modified any editable field or just in specific editable fields.

Cell format (read only)

Object providing details about the user collaborator in this field.
id
	string

User id or group id
email
	optional<string>

User's email address
name
	optional<string>

User's display name (may be omitted if the user hasn't created an account)
permissionLevel
	optional<"none" | "read" | "comment" | "edit" | "create">

User's collaborator permission Level

This is only included if you're observing a webhooks response.
profilePicUrl
	optional<string>

User's profile picture

This is only included if it exists for the user and you're observing a webhooks response.

Field type and options (read only)
type
	"lastModifiedBy"
Last modified time

The time the record was last modified in UTC e.g. "2022-08-29T07:00:00.000Z" or "2022-08-29"

Cell format (read only)
string

Field type and options (read only)
type
	"lastModifiedTime"
options
	object
isValid
	boolean

False if this formula/field configuation has an error
referencedFieldIds
	array of strings | null

The fields to check the last modified time of
result
	null | any of the below objects

This will always be a date or dateTime field config.
Date field config
Date-time field config
Link to another record

Cell format V1
array of strings

Array of linked records IDs from the linked table.

Cell format V2 (webhooks)
array of the below object
id
	string

Record ID
name
	string

Field type and options (read)
type
	"multipleRecordLinks"
options
	object
isReversed
	boolean

Whether linked records are rendered in the reverse order from the cell value in the Airtable UI (i.e. most recent first).

You generally do not need to rely on this option.
linkedTableId
	string

The ID of the table this field links to
prefersSingleRecordLink
	boolean

Whether this field prefers to only have a single linked record. While this preference is enforced in the Airtable UI, it is possible for a field that prefers single linked records to have multiple record links (for example, via copy-and-paste or programmatic updates).
inverseLinkFieldId
	optional<string>

The ID of the field in the linked table that links back to this one
viewIdForRecordSelection
	optional<string>

The ID of the view in the linked table to use when showing a list of records to select from.

Field type and options (write)

Creating "multipleRecordLinks" fields is supported but updating options for existing "multipleRecordLinks" fields is not supported.
type
	"multipleRecordLinks"
options
	object
linkedTableId
	string

The ID of the table this field links to
viewIdForRecordSelection
	optional<string>

The ID of the view in the linked table to use when showing a list of records to select from
Long text

Cell format
string

Multiple lines of text, which may contain "mention tokens", e.g. <airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>

Field type and options
type
	"multilineText"
Lookup

Lookup a field on linked records.

Cell format V1 (read only)
array of (numbers | strings | booleans | any)

Array of cell values from a field in the linked table.

Cell format V2 (webhooks)
valuesByLinkedRecordId
	object
key: string	array of any
linkedRecordIds
	array of strings

Field type and options (read only)
type
	"multipleLookupValues"
options
	object
fieldIdInLinkedTable
	string | null

The field in the linked table that this field is looking up.
isValid
	boolean

Is the field currently valid (e.g. false if the linked record field has been deleted)
recordLinkFieldId
	string | null

The linked record field in the current table.
result
	Field type and options | null

The field type and options inside of the linked table. See other field type configs on this page for the possible values. Can be null if invalid.
Multiple collaborator

Array of objects providing details about the user or user group collaborators in this field.

Note: Adding user groups to multiple collaborator fields is an enterprise feature.

Cell format (read)
array of the below object

Object providing details about the user collaborator in this field.
id
	string

User id or group id
email
	optional<string>

User's email address
name
	optional<string>

User's display name (may be omitted if the user hasn't created an account)
permissionLevel
	optional<"none" | "read" | "comment" | "edit" | "create">

User's collaborator permission Level

This is only included if you're observing a webhooks response.
profilePicUrl
	optional<string>

User's profile picture

This is only included if it exists for the user and you're observing a webhooks response.

Cell format (write)
array of strings

Array of user or group ids

Similar to multipleAttachments and multipleSelects, this array-type field will override the current cell value when being updated. Be sure to spread the current cell value if you want to keep the currently selected collaborators.

Field type and options
type
	"multipleCollaborators"
options
	object
Multiple select

Array of selected option names.

When creating or updating records, if a choice string does not exactly match an existing option, the request will fail with an INVALID_MULTIPLE_CHOICE_OPTIONS error unless the typecast parameter is enabled. If typecast is enabled, a new choice will be created if one does not exactly match.

Similar to multipleAttachments and multipleCollaborators, this array-type field will override the current cell value when being updated. Be sure to spread the current cell value if you want to keep the currently selected choices.

Cell format V1
array of strings

Array of selected option names.

Cell format V2 (webhooks)
array of the below object
id
	string
color
	optional<string>

Optional when the select field is configured to not use colors.

Allowed values: "blueLight2", "cyanLight2", "tealLight2", "greenLight2", "yellowLight2", "orangeLight2", "redLight2", "pinkLight2", "purpleLight2", "grayLight2", "blueLight1", "cyanLight1", "tealLight1", "greenLight1", "yellowLight1", "orangeLight1", "redLight1", "pinkLight1", "purpleLight1", "grayLight1", "blueBright", "cyanBright", "tealBright", "greenBright", "yellowBright", "orangeBright", "redBright", "pinkBright", "purpleBright", "grayBright", "blueDark1", "cyanDark1", "tealDark1", "greenDark1", "yellowDark1", "orangeDark1", "redDark1", "pinkDark1", "purpleDark1", "grayDark1"
name
	string

Field type and options (read)
type
	"multipleSelects"
options
	object
choices
	array of the below object
id
	string
color
	optional<string>

Optional when the select field is configured to not use colors.

Allowed values: "blueLight2", "cyanLight2", "tealLight2", "greenLight2", "yellowLight2", "orangeLight2", "redLight2", "pinkLight2", "purpleLight2", "grayLight2", "blueLight1", "cyanLight1", "tealLight1", "greenLight1", "yellowLight1", "orangeLight1", "redLight1", "pinkLight1", "purpleLight1", "grayLight1", "blueBright", "cyanBright", "tealBright", "greenBright", "yellowBright", "orangeBright", "redBright", "pinkBright", "purpleBright", "grayBright", "blueDark1", "cyanDark1", "tealDark1", "greenDark1", "yellowDark1", "orangeDark1", "redDark1", "pinkDark1", "purpleDark1", "grayDark1"
name
	string

Field type and options (write)
type
	"multipleSelects"
options
	object
choices
	array of the below object
id
	optional<string>

This is not specified when creating new options, useful when specifing existing options (for example: reordering options, keeping old options and adding new ones, etc)
color
	optional<string>

Optional when creating an option.
name
	string
Number

A integer(whole number, e.g. 1, 32, 99) or decimal number showing decimal digits. Precision set with the field config.

Cell format
number

Field type and options
type
	"number"
options
	object
precision
	number

Indicates the number of digits shown to the right of the decimal point for this field. (0-8 inclusive)
Percent

Decimal number representing a percentage value. For example, the underlying cell value for 12.3% is 0.123.

Cell format
number

Field type and options
type
	"percent"
options
	object
precision
	number

Indicates the number of digits shown to the right of the decimal point for this field. (0-8 inclusive)
Phone

A telephone number, e.g. "(415) 555-9876".

Cell format
string

Field type and options
type
	"phoneNumber"
Rating

A positive integer (e.g. "3 stars" is 3). A rating cannot be 0.

Cell format
number

Field type and options

Bases on a free or plus plan are limited to using the 'star' icon and 'yellowBright' color.
type
	"rating"
options
	object
color
	"yellowBright" | "orangeBright" | "redBright" | "pinkBright" | "purpleBright" | "blueBright" | "cyanBright" | "tealBright" | "greenBright" | "grayBright"

The color of selected icons.
icon
	"star" | "heart" | "thumbsUp" | "flag" | "dot"

The icon name used to display the rating.
max
	number

The maximum value for the rating, from 1 to 10 inclusive.
Rich text

Long text (with rich text formatting enabled)

A Markdown-inspired markup language. Learn more about using Markdown in long text's rich text formatting API.

Cell format
string

Field type and options
type
	"richText"
Rollup

A rollup allows you to summarize data from records that are linked to this table.

Cell format V1 (read only)
string | number | true

Cell format V2 (webhooks)
any

Field type and options (read only)
type
	"rollup"
options
	object
fieldIdInLinkedTable
	optional<string>

The id of the field in the linked table
recordLinkFieldId
	optional<string>

The linked field id
result
	optional<Field type and options | null>

The resulting field type and options for the rollup. See other field type configs on this page for the possible values. Can be null if invalid.
isValid
	optional<boolean>
referencedFieldIds
	optional<array of strings>

The ids of any fields referenced in the rollup formula
Single line text

A single line of text.

Cell format
string

Field type and options
type
	"singleLineText"
Single select

Selected option name.

When creating or updating records, if the choice string does not exactly match an existing option, the request will fail with an INVALID_MULTIPLE_CHOICE_OPTIONS error unless the typecast parameter is enabled. If typecast is enabled, a new choice will be created if one does not exactly match.

Cell format V1
string

Cell format V2 (webhooks)
id
	string
color
	optional<string>

Optional when the select field is configured to not use colors.

Allowed values: "blueLight2", "cyanLight2", "tealLight2", "greenLight2", "yellowLight2", "orangeLight2", "redLight2", "pinkLight2", "purpleLight2", "grayLight2", "blueLight1", "cyanLight1", "tealLight1", "greenLight1", "yellowLight1", "orangeLight1", "redLight1", "pinkLight1", "purpleLight1", "grayLight1", "blueBright", "cyanBright", "tealBright", "greenBright", "yellowBright", "orangeBright", "redBright", "pinkBright", "purpleBright", "grayBright", "blueDark1", "cyanDark1", "tealDark1", "greenDark1", "yellowDark1", "orangeDark1", "redDark1", "pinkDark1", "purpleDark1", "grayDark1"
name
	string

Field type and options (read)
type
	"singleSelect"
options
	object
choices
	array of the below object
id
	string
color
	optional<string>

Optional when the select field is configured to not use colors.

Allowed values: "blueLight2", "cyanLight2", "tealLight2", "greenLight2", "yellowLight2", "orangeLight2", "redLight2", "pinkLight2", "purpleLight2", "grayLight2", "blueLight1", "cyanLight1", "tealLight1", "greenLight1", "yellowLight1", "orangeLight1", "redLight1", "pinkLight1", "purpleLight1", "grayLight1", "blueBright", "cyanBright", "tealBright", "greenBright", "yellowBright", "orangeBright", "redBright", "pinkBright", "purpleBright", "grayBright", "blueDark1", "cyanDark1", "tealDark1", "greenDark1", "yellowDark1", "orangeDark1", "redDark1", "pinkDark1", "purpleDark1", "grayDark1"
name
	string

Field type and options (write)
type
	"singleSelect"
options
	object
choices
	array of the below object
id
	optional<string>

This is not specified when creating new options, useful when specifing existing options (for example: reordering options, keeping old options and adding new ones, etc)
color
	optional<string>

Optional when creating an option.
name
	string
Sync source

Shows the name of the source that a record is synced from. This field is only available on synced tables.

Cell format V1 (read only)
string

The sync source name.

Cell format V2 (webhooks)
id
	string

The id unique for this source within this base. Not the baseId.
name
	string

The sync source name.
color
	optional<string>

Field type and options
type
	"externalSyncSource"
options
	object
choices
	array of the below object
id
	string
color
	optional<string>

Optional when the select field is configured to not use colors.

Allowed values: "blueLight2", "cyanLight2", "tealLight2", "greenLight2", "yellowLight2", "orangeLight2", "redLight2", "pinkLight2", "purpleLight2", "grayLight2", "blueLight1", "cyanLight1", "tealLight1", "greenLight1", "yellowLight1", "orangeLight1", "redLight1", "pinkLight1", "purpleLight1", "grayLight1", "blueBright", "cyanBright", "tealBright", "greenBright", "yellowBright", "orangeBright", "redBright", "pinkBright", "purpleBright", "grayBright", "blueDark1", "cyanDark1", "tealDark1", "greenDark1", "yellowDark1", "orangeDark1", "redDark1", "pinkDark1", "purpleDark1", "grayDark1"
name
	string
Url

A valid URL (e.g. airtable.com or https://airtable.com/universe).

Cell format
string

Field type and options
type
	"url"

© AirtableTermsPrivacy